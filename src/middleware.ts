app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true}));
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());
