const handleSubmit = async (e) => {
    e.preventDefault();
  
    const emailData = {
      from: user.user.email, // Sender's email
      to: info.receiverEmail, // Recipient's email (input by the user)
      subject: info.name, // Subject
      description: info.description, // Email body
    };
  
    try {
      const response = await fetch('http://localhost:8000/api/send-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
  
      if (response.ok) {
        toast.success('Email sent successfully!');
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };
  
  export default handleSubmit;
  