async function testFullFlow() {
    try {
        const email = 'testflow' + Date.now() + '@example.com';
        const password = '@Abhi24129';
        
        console.log('1. Sending OTP...');
        const formData = new FormData();
        formData.append('name', 'Test User');
        formData.append('email', email);
        formData.append('password', password);
        
        const formDataText = [];
        for (const [key, value] of formData.entries()) {
            formDataText.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
        
        // Wait, native fetch with FormData in Node 18+ works perfectly.
        const res1 = await fetch('http://localhost:8080/api/admin/send-otp', {
            method: 'POST',
            body: formData
        });
        const text1 = await res1.text();
        console.log('OTP Response:', res1.status, text1);
    } catch(err) {
        console.error(err);
    }
}
testFullFlow();
