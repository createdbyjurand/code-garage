# HttpService

```javascript
// Here we have Service class > dont forget that in JS class is Function
class HttpService {
  constructor() {
    this.data = "Hello data from HttpService";
    this.getData = this.getData.bind(this);
  }

  getData() {
    return this.data;
  }
}

// Making Instance of class > it's object now
const http = new HttpService();

// Here is React Class extended By React
class ReactApp extends React.Component {
  state = {
    data: ""
  };

  componentWillMount() {
    const data = http.getData();

    this.setState({
      data: data
    });
  }

  render() {
    return <div>{this.state.data}</div>;
  }
}
```
