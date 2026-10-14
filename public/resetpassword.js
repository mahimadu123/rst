document.getElementById('resetForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const newpassword = document.getElementById('newpassword').value;
    const messageDiv = document.getElementById('message');

    const pathSegments = window.location.pathname.split('/');
    const requestId = pathSegments[pathSegments.length - 1];

    try {
        messageDiv.style.color = 'blue';
        messageDiv.innerText = 'Updating password...';

        const response = await axios.post(`http://localhost:3000/password/updatepassword/${requestId}`, {
            newpassword: newpassword
        });

        if (response.status === 200) {
            messageDiv.style.color = 'green';
            messageDiv.innerText = 'Password successfully updated! You can now log in.';
            document.getElementById('resetForm').reset();
        }
    } catch (error) {
        console.error(error);
        messageDiv.style.color = 'red';
        messageDiv.innerText = error.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.';
    }
});