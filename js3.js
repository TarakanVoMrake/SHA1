let left = (n, s) => {
    let t4 = ( n<<s ) | (n>>>(32-s))
    return t4
}

let hex1 = (val) => {
    let str=''
    let i
    let vh
    let vl
    for(i = 0; i <= 6; i+=2) {
        vh = (val>>>(i*4+4))&0x0f
        vl = (val>>>(i*4))&0x0f
        str += vh.toString(16) + vl.toString(16)
    }
    return str
}

function hex2(val) {
    let str=''
    let i
    let v
    for(i = 7; i >= 0; i--) {
        v = (val>>>(i*4))&0x0f
        str += v.toString(16)
    }
    return str
}

function utf8(string) {
    let str = ''
    for (let n = 0; n < string.length; n++) {
        let c = string.charCodeAt(n)
        if (c < 128) str += String.fromCharCode(c)
        else if((c > 127) && (c < 2048)) {
            str += String.fromCharCode((c >> 6) | 192)
            str += String.fromCharCode((c & 63) | 128)
        }
        else {
            str += String.fromCharCode((c >> 12) | 224)
            str += String.fromCharCode(((c >> 6) & 63) | 128)
            str += String.fromCharCode((c & 63) | 128)
        }
    }
    return str
}

function SHA1(text) {
    let i, j
    let W = new Array(80)
    let h0 = 0x67452301
    let h1 = 0xEFCDAB89
    let h2 = 0x98BADCFE
    let h3 = 0x10325476
    let h4 = 0xC3D2E1F0
    let A, B, C, D, E
    let temp
    text = utf8(text)
    let msg_len = text.length
    let word_array = new Array()
    for(i = 0; i < msg_len-3; i += 4) {
        j = text.charCodeAt(i)<<24 | text.charCodeAt(i+1)<<16 |
            text.charCodeAt(i+2)<<8 | text.charCodeAt(i+3)
        word_array.push( j )
    }
    switch(msg_len % 4) {
        case 0:
            i = 0x080000000
            break
        case 1:
            i = text.charCodeAt(msg_len-1)<<24 | 0x0800000
            break
        case 2:
            i = text.charCodeAt(msg_len-2)<<24 | text.charCodeAt(msg_len-1)<<16 | 0x08000
            break
        case 3:
            i = text.charCodeAt(msg_len-3)<<24 | text.charCodeAt(msg_len-2)<<16 | text.charCodeAt(msg_len-1)<<8 | 0x80
    }
    word_array.push(i)
    while( (word_array.length % 16) != 14 ) word_array.push( 0 )
    word_array.push( msg_len>>>29 )
    word_array.push( (msg_len<<3)&0x0ffffffff )
    for (let blockstart = 0; blockstart < word_array.length; blockstart += 16 ) {
        for(i = 0; i < 16; i++) W[i] = word_array[blockstart+i]
        for(i = 16; i <= 79; i++) W[i] = left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1)
        A = h0
        B = h1
        C = h2
        D = h3
        E = h4
        for(i = 0; i <= 19; i++) {
            temp = (left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff
            E = D
            D = C
            C = left(B,30)
            B = A
            A = temp
        }
        for(i = 20; i <= 39; i++) {
            temp = (left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff
            E = D
            D = C
            C = left(B,30)
            B = A
            A = temp
        }
        for(i = 40; i <= 59; i++) {
            temp = (left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff
            E = D
            D = C
            C = left(B,30)
            B = A
            A = temp
        }
        for(i = 60; i <= 79; i++) {
            temp = (left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff
            E = D
            D = C
            C = left(B,30)
            B = A
            A = temp
        }
        h0 = (h0 + A) & 0x0ffffffff
        h1 = (h1 + B) & 0x0ffffffff
        h2 = (h2 + C) & 0x0ffffffff
        h3 = (h3 + D) & 0x0ffffffff
        h4 = (h4 + E) & 0x0ffffffff
    }
    let answer = hex2(h0) + hex2(h1) + hex2(h2) + hex2(h3) + hex2(h4)

    return answer.toLowerCase()
}

console.log(SHA1("Hello world!"))