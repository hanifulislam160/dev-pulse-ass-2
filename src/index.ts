import app from "./app";

const main = () =>{
    app.listen(5000, () => {
      console.log(`Example app listening on port ${5000}`);
    });
}

main();