/**
 * X24C02 serial EEPROM (2 Kbit, 256 bytes) as wired on Acclaim's NBA Jam carts:
 * the game bit-bangs an I2C bus through $200000 (SCL, bit 0) and $200001 (SDA, bit 0).
 * Contents live in memory only, like the rest of this player's save handling.
 */
export class X24C02 {
    data = new Uint8Array(256).fill(0xff);
    scl = 1;
    sda = 1;
    /** What the chip drives onto SDA (1 = released). */
    out = 1;
    mode = 'idle';
    next = 'idle';
    n = 0;
    shift = 0;
    addr = 0;
    ackSlot = false;
    masterAck = false;
    /** The SDA line as the game reads it: open-drain, so low if either the game or the chip pulls it low. */
    get line() {
        return this.sda & this.out;
    }
    setScl(value) {
        this.update(value & 1, this.sda);
    }
    setSda(value) {
        this.update(this.scl, value & 1);
    }
    update(scl, sda) {
        if (scl && this.scl && sda !== this.sda) {
            if (!sda)
                this.start();
            else
                this.stop();
        }
        const rising = scl && !this.scl;
        const falling = !scl && this.scl;
        this.scl = scl;
        this.sda = sda;
        if (rising)
            this.rise(sda);
        else if (falling)
            this.fall();
    }
    start() {
        this.mode = 'dev';
        this.n = 0;
        this.shift = 0;
        this.ackSlot = false;
        this.out = 1;
    }
    stop() {
        this.mode = 'idle';
        this.ackSlot = false;
        this.out = 1;
    }
    rise(sda) {
        if (this.mode === 'idle')
            return;
        if (this.mode === 'rd') {
            if (this.ackSlot)
                this.masterAck = sda === 0;
            else
                this.n++;
            return;
        }
        if (!this.ackSlot) {
            this.shift = ((this.shift << 1) | sda) & 0xff;
            this.n++;
        }
    }
    loadRead() {
        this.shift = this.data[this.addr];
        this.n = 0;
        this.out = (this.shift >> 7) & 1;
    }
    fall() {
        if (this.mode === 'idle')
            return;
        if (this.mode === 'rd') {
            if (this.ackSlot) {
                this.ackSlot = false;
                if (this.masterAck) {
                    this.addr = (this.addr + 1) & 0xff;
                    this.loadRead();
                }
                else {
                    this.mode = 'idle';
                    this.out = 1;
                }
            }
            else if (this.n >= 8) {
                this.out = 1;
                this.ackSlot = true;
            }
            else {
                this.out = (this.shift >> (7 - this.n)) & 1;
            }
            return;
        }
        if (this.ackSlot) {
            this.ackSlot = false;
            this.out = 1;
            this.n = 0;
            this.shift = 0;
            this.mode = this.next;
            if (this.mode === 'rd')
                this.loadRead();
            return;
        }
        if (this.n < 8)
            return;
        if (this.mode === 'dev') {
            if ((this.shift >> 4) !== 0xa) {
                this.mode = 'idle';
                return;
            }
            this.next = this.shift & 1 ? 'rd' : 'addr';
        }
        else if (this.mode === 'addr') {
            this.addr = this.shift;
            this.next = 'wr';
        }
        else {
            this.data[this.addr] = this.shift;
            this.addr = (this.addr & 0xf8) | ((this.addr + 1) & 7);
            this.next = 'wr';
        }
        this.out = 0;
        this.ackSlot = true;
    }
}
