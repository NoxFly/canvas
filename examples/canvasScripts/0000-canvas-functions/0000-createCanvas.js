function setup() {
    try {
        createCanvas(documentWidth(), documentHeight(), '#000');
    } catch(e) {
        console.error('Cannot create canvas');
    }
}