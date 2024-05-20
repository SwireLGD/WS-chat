import {createAsyncThunk} from "@reduxjs/toolkit";
import {GlobalError, LoginMutation, RegisterMutation, RegisterResponse, User, ValidationError} from "../../types";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";
import {RootState} from "../../app/store.ts";
import {unsetUser} from "./usersSlice.ts";

export const register = createAsyncThunk<User, RegisterMutation, { rejectValue: ValidationError }>(
    'users/register',
    async (registerMutation, {rejectWithValue}) => {
        try {
            const response = await axiosApi.post<RegisterResponse>('/users', registerMutation);
            return response.data.user;
        } catch (error) {
            if (isAxiosError(error) && error.response && error.response.status === 422) {
                return rejectWithValue(error.response.data);
            }

            throw error;
        }
    }
);

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError }>(
    'users/login',
    async (loginMutation, {rejectWithValue}) => {
        try {
            const response = await axiosApi.post<RegisterResponse>('/users/sessions', loginMutation);
            return response.data.user;
        } catch (error) {
            if (isAxiosError(error) && error.response && error.response.status === 400) {
                return rejectWithValue(error.response.data);
            }

            throw error;
        }
    }
);

export const logout = createAsyncThunk<void, undefined, {state: RootState}>(
    'users/logout',
    async (_, {getState, dispatch}) => {
        const token = getState().users.user?.token;
        await axiosApi.delete('/users/sessions', {headers: {Authorization: `Bearer ${token}`}});
        dispatch(unsetUser());
    }
);