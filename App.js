import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';


const makeBoard = (size, bombs) => {

  let board = [];
  console.log('making board!');

  for (let i=0; i<size; i++) {
    let row = new Array(size).fill(0);
    console.log('here is row', row);
    board.push(row); 
  }

  //randomly pick position
  let pickPosition = () => {
    let x = Math.floor(Math.random()*size);
    let y = Math.floor(Math.random()*size);
    return [x, y];
  }

  let addHints = (row, col) => {

    function incrementCounter (r, c) {
      if (r >=0 && r < size && c>=0 && c < size && board[r][c] >=0) {
        board[r][c] += 1
      }
    }
    
    incrementCounter(row-1, col);
    incrementCounter(row+1, col);
    incrementCounter(row, col+1);
    incrementCounter(row, col-1);
    incrementCounter(row-1, col-1);
    incrementCounter(row-1, col+1);
    incrementCounter(row+1, col-1);
    incrementCounter(row+1, col+1);
  }

  //place bomb
  for (let i=0; i<bombs; i++) {
    let position = pickPosition();
    while (board[position[0]][position[1]]) {
      position = pickPosition();
    }
    board[position[0]][position[1]] = -1;
    //add in edge numbers
    addHints(position[0], position[1]);
  }

  return board;
}


export default class App extends React.Component {

  constructor( props) {
    super(props);
    this.state = {
      board: [],
      currentBoard: []
    }
  }

  componentDidMount() {
    this.setState({
      board: makeBoard(8, 5),
      currentBoard: makeBoard(8)
    })
  }

  styleCell () {

  }

  render() {



    return (

      <View style={styles.container}>
        <Text style={styles.title}>Jenn's Minesweeper Game</Text>
        <View style={styles.board}>
          {this.state.currentBoard.map((row) => {
            return (
              <View>
              <View style={styles.row} />
              {
                row.map((cell) => {
                  if (!cell) {
                    return (
                      <View style={[styles.cell, styles.cellHidden]} >
                        {/* <Text>{cell} </Text> */}
                      </View>
                    )
                  } else {

                    return (
                      <View style={[styles.cell, styles.cellHidden]} >
                          <Text>{cell}</Text>
                      </View>
                    )
                  }
                })
              }
              </View>
            )
          })}
        
        </View>
        {/* <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flex: 2, backgroundColor: 'powderblue'}} />
          <View style={{flex: 1, backgroundColor: 'steelblue'}} />
          <View style={{flex: 1, backgroundColor: 'skyblue'}} /> */}
        {/* </View> */}
        {/* <View style={{width: 150, height: 150, backgroundColor: 'steelblue'}} />
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Image
          style={{width: 50, height: 50}}
          source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
        />      */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontFamily: 'Chalkduster',
    fontSize: 20,
    marginBottom: 20,
  },
  board: {
    padding: 5,
    backgroundColor: '#47525d',
    borderRadius: 10,
    flexDirection: 'row'
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#000000',
  },
  cellHidden: {
    backgroundColor: '#D3D3D3',    
    // borderStyle: 'dotted'
  }
  // cell: {
  //   // width: 5,
  //   // height: 5,
  //   // borderRadius: 5,
  //   backgroundColor: '#7b8994',
  //   // margin: 5,
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // }
});
