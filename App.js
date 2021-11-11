// modules
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const _id = require('mongodb')._id;

// validation, express-validator
const { body, validationResult, check} = require('express-validator');
const methodOverride = require('method-override');

// flash
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// require to db
require('./utils/db');
// require to schema (model)
const {Contact} = require('./model/contact');

// call express
const app = express();
const port = 3000;

// body-parser
app.use(bodyParser.json());

// set-up HTTP Verbs / method-override
// app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('_method'));

// set-up EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));

// konfigurasi flash
app.use(cookieParser('secret'));
// konfigurasi session
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUnintialized: true,
  })
);
// konfigurasi flash
app.use(flash());


// homepage index/index-home
app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'Fuad Jabbar Dzakwan',
            email: 'fuaddzakwan14@gmail.com'
        },
        {
            nama: 'Nurlaela',
            email: 'nurlaela22@gmail.com'
        },
        {
            nama: 'Skadi Corrupting Heart',
            email: 'skalter230@gmail.com'
        }
    ]
    res.render('index', {
        title: 'Halaman Utama',
        mahasiswa,
        layout: 'layouts/main-layout'
    });
});


// about page
app.get('/about', (req, res) => {
    res.render('about', {title: 'Halaman About', layout: 'layouts/main-layout'});
});

// contact page
app.get('/contact', async (req, res) => {
    const contacs = await Contact.find();
    res.render('contact', 
        {
            title: 'Halaman Contact', 
            layout: 'layouts/main-layout',
            contacs,
            msg: req.flash('msg')
        });
});


// add contact
app.get('/contact/add', (req,res) => {
    res.render('add-contact', {
        title: 'Tambah Contact Baru',
        layout: 'layouts/main-layout'
    });
});

// proses add data contact
app.post('/contact', 
    [
        body('nama').custom(async (value) => {
            const namaDuplikat = await Contact.findOne({ nama: value });
            if (namaDuplikat) {
                throw new Error('Nama Sudah Digunakan');
            }
            return true;
        }),
        check('email', 'Email Tidak Valid').isEmail(),
        check('nohp', 'No Handphone Tidak Valid').isMobilePhone('id-ID')
    ], 

    (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            title: 'Tambah Contact Baru',
            layout: 'layouts/main-layout',
            errors: errors.array()
        });
    } else {
        Contact.insertMany(req.body, (error,result) => {
	        // kirimkan flash message
	       	req.flash('msg', 'Contact Baru Berhasil Ditambahkan!');
	        res.redirect('/contact');	
        });
        
    }
    
});


// delete contact
app.delete('/contact', (req,res) => {
	Contact.deleteOne({nama: req.body.nama}).then((result) => {
    	req.flash('msg', 'Contact Berhasil Dihapus!');
    	res.redirect('/contact');	
    });
});


// edit contact
app.get('/contact/edit/:nama', async (req,res) => {
    const contact = await Contact.findOne({nama: req.params.nama});
    res.render('edit-contact', {
        title: 'Edit Contact',
        layout: 'layouts/main-layout',
        contact,
    });
})


// proses ubah data
app.put('/contact', 
    [
        body('nama').custom(async (value, {req}) => {
            const namaDuplikat = await Contact.findOne({nama: value});
            if (value !== req.body.oldNama && namaDuplikat) {
                throw new Error('Nama Sudah Digunakan');
            }
            return true;
        }),
        check('email', 'Email Tidak Valid').isEmail(),
        check('nohp', 'No Handphone Tidak Valid').isMobilePhone('id-ID')
    ], 

    (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            title: 'Edit Contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body,
        });
    } else {
        Contact.updateOne( 
        	{ _id:req.body._id }, 
        	{ $set: {	
        		nama: req.body.nama,
        		nohp: req.body.nohp,
        		email: req.body.email },
        }

  ).then((result) => {
  		// kirimkan flash message
        req.flash('msg', 'Data Contact Berhasil Diubah!');
        res.redirect('/contact');
   });     
  }
 }
);

// detail contact
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama:req.params.nama });
    res.render('detail', 
        {
            title: 'Halaman Detail Contact', 
            layout: 'layouts/main-layout',
            contact
        });
});


// app.get('/contact', (req, res) => {
//     res.sendFile('./contact.html', {root:__dirname});
// });
// // untuk menangani halaman yang tidak tersedia, error-handling middleware simple
// app.use('/', (req, res) => {
//     res.status(404);
//     res.send('404');
// });

// conect the port
app.listen(port, () => {
	console.log(`Mongo Contact App | Listenig in http://localhost:${port}`);
})

