export default function concatenateData(
  cipherText: string,
  initializationVector: string,
  salt: string
) {
  return `${initializationVector}::${salt}::${cipherText}`
}
