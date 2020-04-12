// import styles from './index.css';
import ToDos from './ToDos/ToDos';
import MovieSearch from './MovieSearch/MovieSearch';
import Parse from 'parse';
import { Tabs } from 'antd';

export default function() {
  const {TabPane} = Tabs;

  // init back4app URL and app ID and key
  Parse.initialize("nZUSxT8Yr0ELsMZJLuJOBYcsfNiICfhXOosgZipv", "hXwEdCTISocb5s15PmGu729ECeX5hoczhhL76xQi");
  Parse.serverURL = "https://parseapi.back4app.com/";

  return (
    <div style={{ marginTop: 20 }}>
    <Tabs>
      <TabPane tab={"TODO List"} key={1}>
        <ToDos />
      </TabPane>
      <TabPane tab={"Movie Search"} key={2}>
        <MovieSearch />
      </TabPane>
    </Tabs>
    </div>
  );
}
