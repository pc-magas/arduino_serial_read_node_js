var SerialPort = require('serialport');
const Readline = require('parser-readline');
const Ready = require('parser-ready');
const Regex = require('parser-regex');

const portName = '/dev/ttyACM0';

const port = new SerialPort(portName, {
    baudRate: 19200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
});

//Look over: https://regex101.com/r/QcBTTj/1
const hexRegex=/((\\|0)(x|X)[0-9A-Fa-f]{2})+/g;
const parser = port.pipe(new Ready({ delimiter: 'BEGIN:' })).pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', function(input) {

    console.log("Message: "+input);
    //Sometime stream may escape some data
    const input2=input.replace(/^BEGIN:|(\r|\n|(\\|0)(x|X))/g,"");
    console.log("HEX With replaced \'\\x\' and \'0X\': ",input2);

    try{
        const data=Buffer.from(input2,'hex').toString('utf8')
        console.log("DEC: "+data);
        console.log("\n")
    }catch(e){
        console.error(e);
    }

});
