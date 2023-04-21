const fs = require('fs');
const ejs = require('ejs');
const http = require('http')

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
        case '/':

            if (req.method === "POST") {
                let search = "";
                req.on("data", (data) => {
                    search += data;
                });
        
                // On écoute maintenant la fin de l'envoi des données avec la méthode on et l'attribut end
                req.on("end", () => {
                    console.log(search)
                    const replacer = new RegExp(/\+/, "g");
        
                    searchValue = search.toString().split(/=/).pop().replace(replacer, ' ');
                    console.log(searchValue)
                    
                    // redirection le code 301 indique une redirection permamente
                    res.writeHead(301, { Location: `http://${hostname}:${port}` });
                    res.end();
                });
            }

            const aboutTemplate = fs.readFileSync('./view/home.html', 'utf8');
            const aboutRendered = ejs.render(aboutTemplate);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(aboutRendered);
           
            let users = "<ul>";
            for (const { name,birth } of students){
                if(searchValue === name)
                {
                    console.log("in if: "+searchValue);
                    users += `<li>${name}</li>
                    <li>${birth}</li><br>` ;
                }
                }
            users += "</ul>";

            res.end(`
                    ${users}
                    </body>
                </html>
            `);
            break;
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});