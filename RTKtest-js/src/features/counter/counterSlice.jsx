import { createSlice } from '@reduxjs/toolkit';
//先import creatslice

const initialState = {
  value: 0,
};
//初始狀態

export const counterSlice = createSlice({
  name: 'counter', //slice的名稱
  initialState,
  //reducers為Slice的reducer函式，會根據action type來更新state
  reducers: {
    // increment和decrement是兩個reducer函式，分別用來增加和減少計數器的值,state參數是當前的state，action參數是dispatch時傳入的action動作
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    crossAmount: (state, action) => {
      state.value *= action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
//這裡會自動生成action creator函式，這些函式會返回對應的action物件，並且包含type和payload屬性
export const { increment, decrement, incrementByAmount, crossAmount } = counterSlice.actions;
//這裡將counterSlice.reducer導出，這樣就可以在store中使用這個reducer來管理counter的狀態
export default counterSlice.reducer;
