import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as io from "io-ts";
import icecreamJson from "./icecreams.json";
import { bimap, fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

const IcecreamValidator = io.type({
  name: io.string,
  price: io.number,
});

const IceCreamArrayValidator = io.array(IcecreamValidator);

type IIcecream = io.TypeOf<typeof IcecreamValidator>;
type IIcecreamArray = io.TypeOf<typeof IceCreamArrayValidator>;

const icecreamDatas = IceCreamArrayValidator.decode(icecreamJson)

if (icecreamDatas._tag == "Right") {
  console.log(icecreamDatas.right)
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {
          pipe(icecreamDatas, fold(
            l => (<div>error</div>),
            r => {
              return (
                <div>
                  {r.map(x => (<div>{x.name}</div>))}
                </div>
              )
            }))
        }
      </header>
    </div>
  );
}

export default App;
