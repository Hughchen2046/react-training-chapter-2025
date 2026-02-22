import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, incrementByAmount, crossAmount } from './counterSlice.jsx';

export function Counter() {
  // useSelector是一個React-Redux的hook函式，用來從Redux store中選取state的值，這裡我們選取了counter slice中的value屬性，並將其賦值給count變數
  const count = useSelector((state) => {
    console.dir(state);
    return state.counter.value;
  });
  const dispatch = useDispatch();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button aria-label="Increment value" onClick={() => dispatch(increment())}>
          增加1
        </button>
        <span>RTK 計算數值: {count}</span>
        <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          減少1
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <label htmlFor="incrementAmount">輸入數值</label>
        <input id="incrementAmount" type="text" />
        <button
          aria-label="Increment by Amount"
          onClick={() =>
            dispatch(
              incrementByAmount(Number(document.getElementById('incrementAmount').value) || 0)
            )
          }
        >
          增加輸入的數值
        </button>
      </div>
      <div>
        <label htmlFor="crossAmount">輸入數值</label>
        <input id="crossAmount" type="text" />
        <button
          aria-label="Cross by Amount"
          onClick={() =>
            dispatch(crossAmount(Number(document.getElementById('crossAmount').value) || 0))
          }
        >
          乘以輸入的數值
        </button>
      </div>
    </div>
  );
}
