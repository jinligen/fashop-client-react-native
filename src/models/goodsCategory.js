import goodsCategory from "../services/goodsCategory";

export default {
    namespace: "goodsCategory",
    state: {
        list: {
            result: { list: [], total_number: 0 }
        },
    },

    effects: {
        * list({ payload, callback }, { call, put }) {
            const response = yield call(goodsCategory.list, payload);
            yield put({
                type: "_list",
                payload: response
            });
            if (callback) callback(response);
        }
    },
    reducers: {
        _list(state, action) {
            return {
                ...state,
                list: action.payload
            };
        }
    }
};
