async function run() {
    try {
        const url = "https://res.cloudinary.com/dhdyooirr/image/upload/v1790532851/notes/CN/Unit%201/m2ph9letyn84z4qnwunp.jpg";
        const res = await fetch(url, { method: 'HEAD' });
        console.log("Status for .jpg:", res.status);
    } catch (err) {
        console.error(err);
    }
}
run();
