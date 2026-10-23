const fs = require("fs");
const path = require("path");
const http = require("http");

const dir = path.join(__dirname, "flows");
const files = fs.readdirSync(dir).filter((name) => name.startsWith("flow-") && name.endsWith(".json")).sort();
const all = [];
for (const name of files) {
    const part = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
    all.push(...part);
}
const body = JSON.stringify(all);
const req = http.request({
    hostname: "127.0.0.1",
    port: 1880,
    path: "/flows",
    method: "POST",
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(body),
        "Node-RED-Deployment-Type": "full"
    }
}, (res) => {
    let data = "";
    res.on("data", (chunk) => { data += chunk; });
    res.on("end", () => {
        console.log("STATUS", res.statusCode);
        console.log(data);
        process.exit(res.statusCode >= 200 && res.statusCode < 300 ? 0 : 1);
    });
});
req.on("error", (err) => {
    console.error(err);
    process.exit(1);
});
req.write(body);
req.end();
