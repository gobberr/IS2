const request = require('supertest');
const app = require('../app');

test('api che trova tutti gli annunci',  () => {
    const posts = [{"_id":"5a2ff79f66122d02ce04ac20","userId":"5a2ff72e66122d02ce04ac1f","userName":"Rupert Gobber","subject":"Analisi 1","text":"Offro ripetizioni in Analisi","deleted":false,"__v":0,"location":{"latitude":"46.0747793","longitude":"11.121748600000046"}},{"_id":"5a2ff81266122d02ce04ac23","userId":"5a2ff7e866122d02ce04ac21","userName":"Antonio Conte","subject":"Algoritmi","text":"Offro ripetizioni in Algoritmi","deleted":false,"__v":0,"location":{"latitude":"46.0650227","longitude":"11.123960200000056"}},{"_id":"5a2ff8a066122d02ce04ac25","userId":"5a2ff72e66122d02ce04ac1f","userName":"Rupert Gobber","subject":"Calcolatori","text":"Offro aiuto nello studio in calcolatori","deleted":false,"__v":0,"location":{"latitude":"46.0658551","longitude":"11.152551600000038"}},{"_id":"5a2ffa443e79010327e983ea","userId":"5a2ffa1a3e79010327e983e9","userName":"Walter Zenga","subject":"Chimica 1","text":"Offro aiuto in chimica","deleted":false,"__v":0,"location":{"latitude":"45.417348","longitude":"11.880481099999997"}},{"_id":"5a2ffa593e79010327e983eb","userId":"5a2ffa1a3e79010327e983e9","userName":"Walter Zenga","subject":"Chimica 2","text":"Offro aiuto in chimica 2","deleted":false,"__v":0,"location":{"latitude":"45.417348","longitude":"11.880481099999997"}},{"_id":"5a2ffb583e79010327e983ef","userId":"5a2ff7e866122d02ce04ac21","userName":"Antonio Conte","subject":"Geometria e Algebra Lineare","text":"Offro ripetizioni in Geometria","deleted":false,"__v":0,"location":{"latitude":"46.07701669999999","longitude":"11.119862099999978"}},{"_id":"5a2ffb993e79010327e983f1","userId":"5a2ffb833e79010327e983f0","userName":"Luigi  Del Neri","subject":"Logica","text":"Aiuto nello studio di Logica","deleted":false,"__v":0,"location":{"latitude":"45.8909882","longitude":"11.033991900000046"}},{"_id":"5a2ffdcf3e79010327e983f3","userId":"5a2ffdbc3e79010327e983f2","userName":"Luciano Spalletti","subject":"Probabilità","text":"Aiuto in probabilità","deleted":false,"__v":0,"location":{"latitude":"46.0747793","longitude":"11.121748600000046"}},{"_id":"5a300b0c14a75139c071f629","userId":"5a2fecfda7335d07d8e927bf","userName":"Saverio Turetta","subject":"Fisica 2","text":"Offro tante cose, e ancor di più","deleted":false,"__v":0,"location":{"latitude":"46.0062499","longitude":"11.136673100000053"}},{"_id":"5a307fdc7ae6646314d9a12a","userId":"5a2fecfda7335d07d8e927bf","userName":"Saverio Turetta","subject":"Programmazione 2","text":"nnsc skndc sndc","deleted":false,"__v":0,"location":{"latitude":"40.8517746","longitude":"14.268124400000033"}}];
    
    return request(app).get("/api/allPosts")
    .expect('Content-Type', /json/)
    .expect(posts)
    .expect(200)
})

test('api che trova gli annunci usando le coordinate',  () => {
    const posts="";

    const latitude="46.0062499";
    const longitude="11.136673100000053";
    const distance="1000";
    const subject="";
    return request(app).get("/api/byCoordinates?latitudine="+latitude+"&longitudine="+longitude+"&distance="+distance+"&subject="+subject)
    .expect('Content-Type', /json/)
    .expect(200)
});

test('api che trova gli annunci usando una materia',  () => {
    const posts="";

    const latitude="";
    const longitude="";
    const distance="";
    const subject="Analisi 1";
    return request(app).get("/api/byCoordinates?latitudine="+latitude+"&longitudine="+longitude+"&distance="+distance+"&subject="+subject)
    .expect('Content-Type', /json/)
    .expect(200)
});

test('api che trova gli annunci usando una materia e le coordinate',  () => {
    const posts="";

    const latitude="46.0062499";
    const longitude="11.136673100000053";
    const distance="100";
    const subject="Analisi 1";
    return request(app).get("/api/byCoordinates?latitudine="+latitude+"&longitudine="+longitude+"&distance="+distance+"&subject="+subject)
    .expect('Content-Type', /json/)
    .expect(200)
});

test('api che trova gli annunci errore mancanza tutti i dati',  () => {
    const posts="";

    const latitude="";
    const longitude="";
    const distance="";
    const subject="";
    return request(app).get("/api/byCoordinates?latitudine="+latitude+"&longitudine="+longitude+"&distance="+distance+"&subject="+subject)
    .expect('Content-Type', /json/)
    .expect(200)
});

test('api che trova gli annunci errore mancanza dati coordinate',  () => {
    const posts="";

    const latitude="";
    const longitude="11.136673100000053";
    const distance="";
    const subject="";
    return request(app).get("/api/byCoordinates?latitudine="+latitude+"&longitudine="+longitude+"&distance="+distance+"&subject="+subject)
    .expect('Content-Type', /json/)
    .expect(200)
});

test('api che trova gli annunci errore nessun risultato con una materia',  () => {
    const posts="";

    const latitude="";
    const longitude="";
    const distance="";
    const subject="nkcanksnkc";
    return request(app).get("/api/byCoordinates?latitudine="+latitude+"&longitudine="+longitude+"&distance="+distance+"&subject="+subject)
    .expect('Content-Type', /json/)
    .expect(200);
});

test('api che trova gli annunci errore nessun risultato con delle coordinate',  () => {
    const posts="";

    const latitude="12";
    const longitude="12";
    const distance="1";
    const subject="";
    return request(app).get("/api/byCoordinates?latitudine="+latitude+"&longitudine="+longitude+"&distance="+distance+"&subject="+subject)
    .expect('Content-Type', /json/)
    .expect(200);
});

