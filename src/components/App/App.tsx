import * as React from 'react';

const getBigint = (something: string | number) => {
  return BigInt(something);
}

const App = () => (
  <div>Hello bitch? {getBigint(124413241325124215123412351235).toString()}</div>
);

export default App;