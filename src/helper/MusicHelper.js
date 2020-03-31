import axios from 'axios'
import { Music } from '../musics';
import _ from 'lodash';

let musics;

const findAll = async () => {
    if (musics) {
        return;
    }

    const url = process.env.NODE_ENV === 'production' ? '/ofom2/js/musics.json' : '/js/musics.json';
    const { data } = await axios.get(url);
    if (_.isEmpty(data)) {
        throw Error('please check config.json');
    }

    musics = _.map(data.musics, ({ id, name, cover, src }) => new Music(id, name, cover, src));

    return musics;
};

const findByParam = param => _.find(musics, param);

const findById = id => _.find(musics, { id });

const findByIds = ids => _.filter(musics, ({ id }) => _.includes(ids, id));

const findByIndex = index => _.get(musics, index);

const findIndexByParam = param => _.findIndex(musics, param);

const count = () => _.size(musics);

export default {
    findAll,
    findByParam,
    findById,
    findByIds,
    findByIndex,
    findIndexByParam,
    count,
}