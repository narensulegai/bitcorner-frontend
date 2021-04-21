import React, { useEffect, useRef, useState } from 'react';
import { addSellBitcoins, getSellBitcoins } from '../util/fetch/api';

const SellBitCoin = () => {
  const [sellBitcoins, setSellBitcoins] = useState([]);
  const [marketOrder, setIsMarketPrice] = useState(true);
  const amountRef = useRef(null);
  const currencyRef = useRef(null);
  const minimumPriceRef = useRef(null);

  useEffect(() => {
    (async () => {
      setSellBitcoins(await getSellBitcoins());
    })();
  }, []);

  const handleOnSellBitcoin = async () => {
    const amount = amountRef.current.value;
    const currency = currencyRef.current.value;
    let minPrice = null;
    if (!marketOrder) {
      minPrice = minimumPriceRef.current.value;
    }
    const d = {
      marketOrder,
      minPrice,
      amount,
      currency,
    };
    await addSellBitcoins(d);
    window.message('Added new sell orider!');
    amountRef.current.value = '';
    currencyRef.current.value = '';
    setIsMarketPrice(true);
    setSellBitcoins(await getSellBitcoins());
  };

  const handleOnMarketPriceChange = () => {
    setIsMarketPrice(!marketOrder);
  };

  return (
    <div className="flex">

      <div className="flex-full">
        <div>
          <h2>Sell Bitcoin</h2>
        </div>
        <div>
          <div className="small-margin-top">
            Amount <br /><input type="number" ref={amountRef} defaultValue="0" />
          </div>
          <div className="small-margin-top">
            Currency <br /><input type="text" ref={currencyRef} defaultValue="USD" />
          </div>
          <div className="small-margin-top">
            Market price &nbsp;<input type="checkbox" checked={marketOrder}
              onChange={handleOnMarketPriceChange} />
          </div>
          {!marketOrder && (
            <div className="small-margin-top">
              Minimum price <br /><input type="number" ref={minimumPriceRef} defaultValue="0" />
            </div>
          )}
          <div>
            <button className="button" onClick={handleOnSellBitcoin}>Sell bitcoin</button>
          </div>
        </div>
      </div>

      <div className="flex-full">
        <div>{sellBitcoins.length === 0 && <div>You have no bit coins to sell</div>}</div>
        <table className="table">
          <thead>
            <tr>
              <td>Currency</td>
              <td>Amount</td>
              <td>Price type</td>
              <td>Minimum price</td>
            </tr>
          </thead>
          <tbody>
            {sellBitcoins.map((b) => {
              return (
                <tr key={b.id}>
                  <td>{b.currency}</td>
                  <td>{b.amount}</td>
                  <td>{b.marketOrder ? 'Market order' : 'Limit order'} </td>
                  <td>{b.minPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellBitCoin;
