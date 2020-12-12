import React  from 'react';
import { StyleSheet, Text, View,FlatList,TextInput,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import db from '../config';
import { ScrollView } from 'react-native-gesture-handler';

export default class SearchScreenTest extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      allTransactions :[],
      lastVisibleTransaction: null,
      search: ''
    }
  }

  searchTransactions= async(text) =>{
    var enteredText = text.split("")  
    if (enteredText[0].toUpperCase() ==='B'){
      const transaction =  await db.collection("transactions").where('bookId','==',text).get()
      transaction.docs.map((doc)=>{
        this.setState({
          //allTransactions:[...this.state.allTransactions,doc.data()],
          allTransactions: doc.data(),
          lastVisibleTransaction: doc
        })
      })
    }
    else if(enteredText[0].toUpperCase() === 'S'){
      const transaction = await db.collection('transactions').where('studentId','==',text).get()
      transaction.docs.map((doc)=>{
        this.setState({
          //allTransactions:[...this.state.allTransactions,doc.data()],
          allTransactions: doc.data(),
          lastVisibleTransaction: doc
        })
      })
    }
  }

  fetchMoreTransactions = async ()=>{
    console.log(this.state.search);
    if(this.state.search !== undefined){
        var text = this.state.search.toUpperCase()
        var enteredText = text.split("")

        
        if (enteredText[0].toUpperCase() ==='B'){
        const query = await db.collection("transactions").where('bookId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
        query.docs.map((doc)=>{
          this.setState({
          // allTransactions: [...this.state.allTransactions, doc.data()],
          allTransactions: doc.data(),
            lastVisibleTransaction: doc
          })
        })
  }
  }
    else if(enteredText[0].toUpperCase() === 'S'){
      const query = await db.collection("transactions").where('bookId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
      query.docs.map((doc)=>{
        this.setState({
          //allTransactions: [...this.state.allTransactions, doc.data()],
          allTransactions: doc.data(),
          lastVisibleTransaction: doc
        })
      })
    }
}


  componentDidMount = async ()=>{
   /* const query = await db.collection("transactions").get()
    query.docs.map((doc)=>{
      this.setState({
        //allTransactions: [...this.state.allTransactions,doc.data()],
        allTransactions: doc.data(),
        lastVisibleTransaction: doc,
        search :''
      })
      console.log(this.state.allTransactions);
    })*/
    const query = await db.collection("transactions")
    .onSnapshot((snapshot)=>{
      var transactions = snapshot.docs.map(document => document.data());
      this.setState({
        allTransactions : transactions,
        lastVisibleTransaction: document,
        search :''
      });
      console.log(this.state.allTransactions);
    })
    //
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
            key={i}
            title={"Book Id: " + item.bookId}
            subtitle={"Transaction Type: " + item.transactionType}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            rightElement={<Text>{"Student Id: " + item.studentId }</Text>}
            leftElement = {"Date: " + item.date.toDate()}
            bottomDivider
            />
        
     
    )
  }
  render(){
    return (
     /* */
     
      <View style={styles.container}>
      <View style={styles.searchBar}>
    <TextInput 
      style ={styles.bar}
      placeholder = "Enter Book Id or Student Id"
      onChangeText={(text)=>{this.setState({search:text})}}/>
      <TouchableOpacity
        style = {styles.searchButton}
        onPress={()=>{this.searchTransactions(this.state.search)}}
      >
        <Text>Search</Text>
      </TouchableOpacity>
      <FlatList
            data={this.state.allTransactions}
            renderItem={({ item,index }) => {
                console.log("item is",item);
                var array = JSON.parse(item);
        return(
            <View style={{flexDirection:"row"}}>
            {array.map((item, key) => 
            {
                return(
                <View>
                  <Text> {item} </Text>
                </View>
              )
            })}
            </View>
        )
        } }
            keyExtractor={item => item.id}
          />
     {/* <ScrollView>
        
        {this.state.allTransactions.map((transaction,index)=>{
          return (
            
            <View key={index} style={{ borderBottomWidth: 2 }}>
              <Text>{"Book Id : " + transaction.bookId}</Text>
              <Text>{"Student Id : " + transaction.studentId}</Text>
              <Text>{"Transaction Type : " + transaction.transactionType}</Text>
              <Text>{"Date : " + transaction.date.toDate()}</Text>

            </View>
          );
        })}
      </ScrollView>*/}
      </View>
     
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  searchBar:{
    flexDirection:'row',
    height:40,
    width:'auto',
    borderWidth:0.5,
    alignItems:'center',
    backgroundColor:'grey',

  },
  bar:{
    borderWidth:2,
    height:30,
    width:300,
    paddingLeft:10,
  },
  searchButton:{
    borderWidth:1,
    height:30,
    width:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'green'
  }
})