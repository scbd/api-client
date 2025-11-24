import lstring from "./lstring";

interface Treaty {
  signature: String;
  instrument: String;
  deposit: String;
  party: String
};

type TreatyName = "XXVII8" | "XXVII8a" | "XXVII8b" | "XXVII8c";

export default interface Country {
  code: String;
  code2?: String;
  code3?: String;
  name: lstring;
  treaties: { [name in TreatyName]: Treaty };
};
