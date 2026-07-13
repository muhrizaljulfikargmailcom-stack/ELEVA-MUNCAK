function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    crc ^= (code << 8);
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = (crc << 1);
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

console.log("CRC for old string:", crc16("00020101021226650016ID10265279665700103A015204531153033605802ID5915FEBBY'S, OTOMOTIF6005MALANG61056512662070703A016304"));
