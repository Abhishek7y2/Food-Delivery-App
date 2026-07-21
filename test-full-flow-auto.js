const { execSync } = require('child_process');

async function testFullFlow() {
    try {
        const email = 'test' + Date.now() + '@example.com';
        const password = '@Abhi24129';
        
        console.log('1. Sending OTP...');
        const formData = new FormData();
        formData.append('name', 'Test User');
        formData.append('email', email);
        formData.append('password', password);
        
        const res1 = await fetch('http://localhost:8080/api/admin/send-otp', {
            method: 'POST',
            body: formData
        });
        console.log('OTP Response:', await res1.text());
        
        console.log('2. Fetching OTP from DB...');
        // Query mongo for the OTP
        const mongoOutput = execSync(`mongosh foodies --quiet --eval "db.admin_otps.findOne({email: '${email}'}).otp"`).toString().trim();
        const otp = mongoOutput.replace(/"/g, '');
        console.log('Got OTP:', otp);
        
        console.log('3. Verifying Signup...');
        const res2 = await fetch('http://localhost:8080/api/admin/verify-signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, otp })
        });
        console.log('Verify Response:', await res2.text());
        
        console.log('4. Logging in...');
        const res3 = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });
        console.log('Login Status:', res3.status);
        console.log('Login Response:', await res3.text());
    } catch(err) {
        console.error(err);
    }
}
testFullFlow();
