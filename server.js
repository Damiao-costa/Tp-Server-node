const fs = require('fs');
const ejs = require('ejs');
const http = require('http');
const dayjs = require('dayjs');
require('dayjs/locale/fr');
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.locale('fr');
dayjs.extend(localizedFormat)

const hostname = "127.0.0.1";
const port = 3000;

let searchValue= "";

const students = [
    { name : "Sonia", birth : "2019-14-05"},
    { name : "Antoine", birth : "2000-12-05"},
    { name : "Alice", birth : "1990-14-09"},
    { name : "Sophie", birth : "2001-10-02"},
    { name : "Bernard", birth : "1980-21-08"}
];

const server = http.createServer((req, res)=>{

    switch (req.url){
        case '/css':
            res.writeHead(200, { "Content-Type": "text/css" });
            const css = fs.readFileSync("./assets/css/style.css");
            res.write(css);
            res.end();
            break;

        case '/':
            const aboutTemplate = fs.readFileSync('./view/home.html', 'utf8');
            const aboutRendered = ejs.render(aboutTemplate);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(aboutRendered);
           
            let users = "<ul>";
            for (const { name,birth } of students){
                const date = dayjs(birth, "YYYY-MM-DD").format('LL');
                users += `<li>Name: ${name}  Date: ${date} <button type="submit" href="/"> Delete </button></li> <br>` ;
            }
            users += "</ul>";

            res.end(`
                    ${users}
                    </body>
                </html>
            `);
            break;

        case '/post':
            if (req.method === "POST") {
                let search = "";
                req.on("data", (data) => {
                    search += data;
                });
        
                // On écoute maintenant la fin de l'envoi des données avec la méthode on et l'attribut end
                req.on("end", () => {
                    const replacer = new RegExp(/\+/, "g");
        
                    searchValue = search.toString().split(/=/).pop().replace(replacer, ' ');
                    if(searchValue.length > 1)
                    {
                        students.push({
                            name:searchValue, birth: new Date()
                        });
                    }
                    // redirection le code 301 indique une redirection permamente
                    res.writeHead(301, { Location: `http://${hostname}:${port}` });
                    res.end();
                });
            }
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});