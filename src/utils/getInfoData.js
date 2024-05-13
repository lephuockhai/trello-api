import _ from 'lodash'

export const getInfoData = ({ filled = [], object = [] }) => {
    return _.pick(object, filled)
}