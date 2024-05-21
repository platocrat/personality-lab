import {
  BinaryLike,
  pbkdf2Sync,
  randomBytes,
} from 'crypto'


/**
 * @dev Server-side cryptography using Node.js's built-in `crypto` library
 */
class SSCrypto {
  private static readonly ALGORITHM = 'sha512'
  private static readonly ITERATIONS = 1_000_000
  private static readonly KEYLEN = 64
  private static readonly HASHED_PASSWORD_ENCODING = 'hex'
  private static readonly SYMBOLS = `#@*+-_;,.?!()/{}&'`
  private static readonly CAPITAL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  private static readonly LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
  private static readonly NUMBERS = '0123456789'
  private static readonly ALL_CHARS = SSCrypto.SYMBOLS 
    + SSCrypto.CAPITAL_LETTERS + SSCrypto.LOWERCASE_LETTERS + SSCrypto.NUMBERS

  private salt: string

  constructor () {
    this.salt = randomBytes(16).toString('hex')
  }

  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private static getRandomChar(chars: string): string {
    return chars[Math.floor(Math.random() * chars.length)]
  }

  public hashPassword(
    password: string
  ): { salt: string, hash: string } {
    let hashedPassword = pbkdf2Sync(
      password,
      this.salt,
      SSCrypto.ITERATIONS,
      SSCrypto.KEYLEN,
      SSCrypto.ALGORITHM
    ).toString(SSCrypto.HASHED_PASSWORD_ENCODING)

    const numberOfInsertions = 64

    for (let i = 0; i < numberOfInsertions; i++) {
      const charToInsert = SSCrypto.getRandomChar(SSCrypto.ALL_CHARS)
      const indexToInsert = SSCrypto.getRandomInt(0, hashedPassword.length)

      hashedPassword = hashedPassword.slice(
        0, 
        indexToInsert
      ) + charToInsert + hashedPassword.slice(indexToInsert)
    }

    return { 
      salt: this.salt, 
      hash: hashedPassword 
    }
  }

  public verifyPassword(
    password: string, 
    hash: string,
    salt: string
  ): boolean {
    const hashToVerify = pbkdf2Sync(
      password,
      salt,
      SSCrypto.ITERATIONS,
      SSCrypto.KEYLEN * 2,
      SSCrypto.ALGORITHM
    ).toString(SSCrypto.HASHED_PASSWORD_ENCODING)

    return hash === hashToVerify
  }
}

export default SSCrypto