import * as React from 'react';

import { powByMod, gcd, extendedGcd, DiffieHellman } from '../../labs/lab1';

const App = () => {
  const diffieHellman = new DiffieHellman();
  const X1: bigint = diffieHellman.generatePrivateKey();
  const X2: bigint = diffieHellman.generatePrivateKey();
  // console.log('X1: ', X1, '\nX2: ', X2);

  const Y1: bigint = diffieHellman.generatePublicKey(X1);
  const Y2: bigint = diffieHellman.generatePublicKey(X2);
  // console.log('Y1: ', Y1, '\nY2: ', Y2);

  const Z12: bigint = diffieHellman.generateSharedKey(Y1, X2);
  const Z21: bigint = diffieHellman.generateSharedKey(Y2, X1);
  // console.log('Z12: ', Z12, 'Z21: ', Z21);
  console.log(Z12 === Z21);

  return (
    <div>
      Making UI for it is so boooring. Hey man? look at console please. just hit F12!
    </div>
  );
}

export default App;