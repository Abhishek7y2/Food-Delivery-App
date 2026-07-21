async function testHash() {
    try {
        const res = await fetch('http://localhost:8080/api/test-hash', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'abhishek7y3@gmail.com',
                password: '@Abhi24129'
            })
        });
        const text = await res.text();
        console.log('STATUS:', res.status);
        console.log('RESPONSE:', text);
    } catch (err) {
        console.error('ERROR:', err);
    }
}
testHash();
