/* eslint-disable-next-line no-restricted-globals */
if (!("TextDecoder" in self)) {
  import("text-encoding-utf-8").then(({ TextDecoder, TextEncoder }) => {
    /* eslint-disable-next-line no-restricted-globals */
    self.TextDecoder = TextDecoder;
    /* eslint-disable-next-line no-restricted-globals */
    self.TextEncoder = TextEncoder;
  });
}

export const encode = (value) => new TextEncoder("utf-8").encode(value);
export const decode = (value) => new TextDecoder("utf-8").decode(value);
