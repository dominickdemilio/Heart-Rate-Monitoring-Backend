
# Heartbeat Sensor Project  

This project uses the **MAX30102 pulse oximeter and heart rate sensor** in combination with a **Particle Argon microcontroller** to measure and display heartbeat and blood oxygen data.  

## Features 
- Account Creation  
- Login/Logout  
- Required Strong Password  
- Password Changes  
- Device Registration  
- Periodic Measurements  
- Weekly Summary Reports  
- Offline Storage

## Links  

- **Server**: [Heartbeat Sensor Web Application](http://ec2-100-26-48-143.compute-1.amazonaws.com:3000)  
- **Design Demo Video**: [Design Demo Video](https://youtu.be/YQfwvGCh3cs)
- **Particle Code Video**: [Particle Code Video](https://youtu.be/_jSMzIh8_gE)
- **Particle Demo Video**: [Particle Demo Video](https://youtube.com/shorts/-Ay3gerkhQ0?si=4YNR-Fa2ultlBOyU)
- **Video Pitch**: [Video Pitch](https://youtu.be/w6FfYUQzzC8)
- **Documentation** [Documentation](https://docs.google.com/document/d/1ddRWPld84Oiazog44HAjbyW7NMegbkZZd0ZjnF1PSaQ/edit?usp=sharing)
  

## Demo Account  

Use the following login credentials to access an existing user account with recently collected data:  

- **Email**: user@email.com 
- **Password**: Password1!  

Log in to explore features such as periodic measurements and the weekly summary of heartbeat data.


## Components  

- **MAX30102 Sensor**: Pulse oximeter and heart rate monitor  
- **Particle Argon**: Wi-Fi-enabled microcontroller for data processing and communication  
- Supporting components: Breadboard, jumper wires, power supply, antenna  

## Setup Instructions  

### Hardware Connections  

1. Connect the **MAX30102 sensor** to the **Particle Argon** as follows:  
   - **VIN** → **3.3V** on the Argon  
   - **GND** → **GND** on the Argon  
   - **SCL** → **D1 (SCL)** on the Argon  
   - **SDA** → **D0 (SDA)** on the Argon   

### Software Setup  

1. Install Visual Studio Code
2. Clone the Heart-Rate-Monitoring-Frontend repository from github [Frontend](https://github.com/dominickdemilio/Heart-Rate-Monitoring-Frontend.git) 
3. Clone the Heart-Rate-Monitoring-Backend repository from github [Backend](https://github.com/dominickdemilio/Heart-Rate-Monitoring-Backend.git)
4. In the Visual Studio Code terminal for the frontend cd frontend
5. In the Visual Studio Code terminal for the frontend npm install
6. In the Visual Studio Code terminal for the frontend npm start
7. Install MongoDB: [MongoDB](https://www.mongodb.com/try/download/community)
8. In the Visual Studio Code terminal for the backend node app.js  

## Usage  

1. Power up the Argon device.
2. Create account and login
3. Register Argon Device to Heart Track  
4. Place your fingertip gently on the MAX30102 sensor.  
5. The sensor will begin detecting your heartbeat, and data will be processed by the Particle Argon.  
6. Take measurements every half hour as prompted and view results using the daily view and weekly summary tabs 

 


