import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

export const singInUser = createAsyncThunk<User, FieldValues >(
    'account/signInUser',
    async (data, thunkApi) => {
        try {
            const userDto = await agent.Account.login(data);
            const {basket, ...user} = userDto;
            if (basket) thunkApi.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user))
            return user;
        } catch (error: any) {
            return thunkApi.rejectWithValue({ error: error.data })
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkApi) => {
        thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.Account.currentUser();
            const {basket, ...user} = userDto;
            if (basket) thunkApi.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user))
            return user;
        } catch (error: any) {
            return thunkApi.rejectWithValue({ error: error.data })
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        singOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            history.push('/');
        },
        setUser: (state,action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state) =>{
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again ');
            history.push('/');
        })
        builder.addMatcher(isAnyOf(singInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) =>{
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(singInUser.rejected), (state, action) => {
            throw action.payload;
        })
    })
})


export const {singOut, setUser} = accountSlice.actions;