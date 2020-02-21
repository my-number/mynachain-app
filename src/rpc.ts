import axios from 'axios'

let id = 0;

export default async function call<T = any>(method: string, params: any = null): Promise<T> {
  id++
  const result = await axios({
    method: "post",
    url: "http://localhost:3030",
    timeout: 10000,
    data: {
      jsonrpc: "2.0",
      id,
      method,
      params
    }
  })
  if (result.data.error) {
    throw new Error(result.data.error.message)
  }
  return result.data.result
}

export class Reader {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  async open(): Promise<Card> {
    const result = await call<number>("openReader", [this.name]);
    return new Card(result)
  }
}
export class Card {
  fd: number;
  constructor(fd: number) {
    this.fd = fd
  }

  async getStatus(): Promise<any> {
    if (this.fd < 0) throw new Error("Card not selected")
    const result = await call<{ name: string[], atr: any }>("getStatus", [this.fd]);
    return result
  }
  async getCert(): Promise<any> {
    if (this.fd < 0) throw new Error("Card not selected")
    const result = await call<{ cert: string }>("getCert", [this.fd]);
    return result.cert
  }
  async computeSig(pin: string, hashHex: string): Promise<any> {
    if (this.fd < 0) throw new Error("Card not selected")

    /*
    let em = Buffer.allocUnsafe(128).fill(0xff) // 0xff-initialized buffer that is as long as pubkey
    // EM = 0x00 || 0x01 || PS || 0x00 || T
    em[0] = 0x00;
    em[1] = 0x01;
    // 0x00 || T = 0x00 || prefix || hashed
    let zeroT = Buffer.from("003031300d060960864801650304020105000420" + hashHex, "hex")

    zeroT.copy(em, em.length - zeroT.length)
    */

    // only SHA256 hash is accepted
    const result = await call<{ sig: string }>("computeSig", [this.fd, pin, "3031300d060960864801650304020105000420" + hashHex]);
    return result.sig
  }
  async reconnect(): Promise<null> {
    if (this.fd < 0) throw new Error("Card not selected")
    await call("reconnect", [this.fd]);
    return null
  }
}
export async function getReaders(): Promise<Reader[]> {
  const result = await call<string[]>("getReaders");
  return result.map(r => new Reader(r))
}

let currentCard: Card = new Card(-1);

export { currentCard };
