const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {

        if (req.query.symbol) {
            // Add your allowed domains here
            const allowedDomains = ['example.com'];
            
            try {
                const baseUrl = new URL(req.query.url);
                
                // Validate protocol
                if (baseUrl.protocol !== 'http:' && baseUrl.protocol !== 'https:') {
                    return res.status(400).send('Invalid protocol');
                }
                
                // Validate domain
                if (!allowedDomains.includes(baseUrl.hostname)) {
                    return res.status(400).send('Domain not allowed');
                }
                
                // Safely construct URL with symbol parameter
                baseUrl.searchParams.set('symbol', req.query.symbol);
                const url = baseUrl.href;
                
                return needle.get(url, (error, newResponse, body) => {
                if (!error && newResponse.statusCode === 200) {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                }
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                if (body) {
                    res.write(body);
                }
                return res.end();
            });
            } catch (error) {
                return res.status(400).send('Invalid URL');
            }
        }

        return res.render("research", {
            environmentalScripts
        });
    };

}

module.exports = ResearchHandler;
