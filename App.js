import React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';


const makeBoard = (size, bombs) => {

  let board = [];

  for (let i=0; i<size; i++) {
    let row = new Array(size).fill(0);
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
    while (board[position[0]][position[1]] < 0) {
      position = pickPosition();
    }
    board[position[0]][position[1]] = -1;
    //add in edge numbers
    addHints(position[0], position[1]);
  }

  console.log('here is board', board);
  return board;
}



export default class App extends React.Component {

  constructor( props) {
    super(props);
    this.state = {
      board: [],
      currentBoard: []
    }
    this.handlePress = this.handlePress.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  componentDidMount() {
    this.setState({
      board: makeBoard(8, 10),
      currentBoard: makeBoard(8),
      hasLost: false
    })
  }

  resetGame() {
    this.setState({
      board: makeBoard(8, 10),
      currentBoard: makeBoard(8),
      hasLost: false
    })
  }

  handlePress (row, col) {

    if (this.state.hasLost) {
      return;
    }

    let board = this.state.currentBoard.slice(0);

    if (this.state.board[row][col] > 0) {
      //if number, just reveal number
      board[row][col] = 1;
    } else if (this.state.board[row][col] === -1) {
      //reveal square
      //you lose!
      board[row][col] = 1;
      this.setState({
        hasLost: true
      })
    } else {

      let context = this;
      board[row][col] = 1;
      function revealSquares (row, col) {

        function toggleSquare (r, c) {
          if (r >= 0 && r < 8 && c >= 0 && c < 8 && context.state.board[r][c] !== -1 && context.state.currentBoard[r][c] === 0 ) {
            board[r][c] = 1;
            if (context.state.board[r][c] === 0) {
              revealSquares(r, c);
            }
          }
        }

        toggleSquare(row-1, col);
        toggleSquare(row+1, col);
        toggleSquare(row, col+1);
        toggleSquare(row, col-1);
        toggleSquare(row-1, col-1);
        toggleSquare(row-1, col+1);
        toggleSquare(row+1, col-1);
        toggleSquare(row+1, col+1);
      }
      revealSquares(row, col);
    }
    //

    this.setState({
      currentBoard: board
    })



  }

  render() {
    return (

      <View style={styles.container}>
        <Text style={styles.title}>Jenn's Minesweeper Game</Text>
        <Text style={styles.title}>{this.state.hasLost ? 'You lost!' : '' }</Text>
        <View style={styles.board}>
          {this.state.currentBoard.map((row, r) => {
            return (
              <View style={styles.row} >
              <View />
              {
                row.map((cell, c) => {
                  if (!cell) {
                    return (
                      <TouchableHighlight onPress={() => this.handlePress(r,c)}>
                        <View style={[styles.cell, styles.cellHidden]} >
                        </View>
                      </TouchableHighlight>
                    )
                  } else {

                    return (
                      // <TouchableHighlight onPress={() => this.handlePress(y,x)}>
                        <View style={[styles.cell, styles.cellRevealed]} >
                            <Text>{this.state.board[r][c]===-1 ? 'X' : this.state.board[r][c]}</Text>
                        </View>
                      // </TouchableHighlight>

                    )
                  }
                })
              }
              </View>
            )
          })}
        
        </View>
        <Button
            onPress={this.resetGame}
            title="Reset Game"
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // flexDirection: 'row'
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
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#000000',
    // flexDirection: 'row'
  },
  cellHidden: {
    backgroundColor: '#D3D3D3',    
    // borderStyle: 'dotted'
  },
  cellRevealed: {
    backgroundColor: '#939393',    
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
