
export default io => {
    io.on('connection', () => {
        console.log('Connection made');
    });
};
