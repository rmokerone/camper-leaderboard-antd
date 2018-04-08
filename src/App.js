import './App.css';
import React, {Component} from 'react';
import {Avatar, Layout} from 'antd';
import {Table, Icon} from 'antd';
import {Row, Col} from 'antd';
import axios from 'axios';

const {Header, Content, Footer} = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowRecent: true,
      recentTimeData: [],
      allTimeData: []
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    const recentTimeUrl = "https://fcctop100.herokuapp.com/api/fccusers/top/recent";
    const allTimeUrl = "https://fcctop100.herokuapp.com/api/fccusers/top/alltime";
    axios
      .get(recentTimeUrl)
      .then(response => {
        var i = 1;
        this.setState({
          recentTimeData: response
            .data
            .map(user => {
              return {
                ...user,
                key: i++
              }
            })
        })
      })
      .catch(error => {
        console.log("Fetch data error" + error);
      });
    axios
      .get(allTimeUrl)
      .then(response => {
        var i = 1;
        this.setState({
          allTimeData: response
            .data
            .map(user => {
              return {
                ...user,
                key: i++
              }
            }),
          isLoading: true
        })
      })
      .catch(error => {
        console.log("Fetch data error" + error);
      });
    console.log("fetchData end")
  }

  handleClick(e, type) {
    e.preventDefault();
    if (type === "recent") {
      this.setState({isShowRecent: true})
    } else if (type === "alltime") {
      this.setState({isShowRecent: false})
    } else {
      console.log("click handle error")
    }
  }

  render() {

    const {isLoading, isShowRecent, recentTimeData, allTimeData} = this.state;
    const columns = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key'
      }, {
        title: 'Camper Name',
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => <a href={"https://www.freecodecamp.com/" + text} target="_blank"><Avatar src={record.img}/> {text}</a>
      }, {
        title: <a href="recent show" onClick={e => this.handleClick(e, 'recent')}>Points in past 30 days{isShowRecent
            ? <Icon type="caret-down"/>
            : ''}</a>,
        dataIndex: 'recent',
        key: 'recent'
      }, {
        title: <a href="alltime show" onClick={e => this.handleClick(e, 'alltime')}>All time points{!isShowRecent
            ? <Icon type="caret-down"/>
            : ''}</a>,
        dataIndex: 'alltime',
        key: 'alltime'
      }
    ];

    return (
      <div id="App">
        <Header>
          <h1 id="title">LeaderBoard<a
            href="refresh"
            onClick={e => {
        e.preventDefault();
        this.setState({isLoading: false});
        this.fetchData();
      }}><Icon type="reload"/></a>
          </h1>
        </Header>
        {isLoading
          ? <Content>
              <Row>
                <Col span={4}/>
                <Col span={16}>
                  <Table
                    pagination={false}
                    columns={columns}
                    dataSource={isShowRecent
                    ? recentTimeData
                    : allTimeData}/>
                </Col>
                <Col span={4}/>
              </Row>
            </Content>
          : <h1 id="info">Wating for seconds...</h1>
        }
        <Footer>Footer</Footer>

      </div>
    );
  }
}

export default App;
