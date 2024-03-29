import { call, put, takeLatest } from 'redux-saga/effects';

import { API } from '../../../../api';

import { alertPush } from '../../alert';

import { marketsData, marketsError, marketsTickersData, marketsTickersError, setCurrentMarketIfUnset, } from '../actions';

import { MARKETS_FETCH, MARKETS_TICKERS_FETCH } from '../constants';

const marketsRequestOptions = {

    apiVersion: 'peatio',

};

const tickersOptions = {

    apiVersion: 'peatio',

};

export function* rootMarketsSaga() {

    yield takeLatest(MARKETS_FETCH, marketsFetchSaga);

    yield takeLatest(MARKETS_TICKERS_FETCH, tickersSaga);

}

export function* marketsFetchSaga() {

    try {

        const markets = yield call(API.get(marketsRequestOptions), '/public/markets');

        yield put(marketsData(markets));

        yield put(setCurrentMarketIfUnset(markets[0]));

    }

    catch (error) {

        yield put(marketsError());

        yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));

    }

}

export function* tickersSaga(action) {

    try {

        const tickers = yield call(API.get(tickersOptions), `/public/markets/tickers`);

        if (tickers) {

            const pairs = Object.keys(tickers);

            const convertedTickers = pairs.reduce((result, pair) => {

                result[pair] = tickers[pair].ticker;

                return result;

            }, {});

            yield put(marketsTickersData(convertedTickers));

        }

    }

    catch (error) {

        yield put(marketsTickersError());

        yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));

    }

}
