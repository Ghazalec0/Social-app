 export function generateOTP() {
  const minNumber = 100000;
  const MaxNumber = 900000;
  return Math.floor(Math.random() * minNumber + MaxNumber);
}