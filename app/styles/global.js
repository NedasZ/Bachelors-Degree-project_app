import { StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch', //cross axis
        
        justifyContent: 'center', //main axis
        textAlign: 'center',
        //marginHorizontal: 16,
        padding: 20,

    },
    button: {
        marginTop: 40,
        //padding: 30,
        backgroundColor: 'lightcyan',
        borderWidth: 5,
        borderColor: 'black',
    },
    titleText: {
        height: 100,
        position: "absolute",
        top: 100,
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
    },
    inputView: {
        backgroundColor: "lightcyan",
        borderRadius: 30,
        //width: "70%",
        height: 45,
        //marginBottom: 20,
        alignItems: "flex-start",
      },      
      TextInput: {
        height: 50,
        flex: 3,
        padding: 5,
        marginLeft: 20,
      },
      loginBtn:{
        alignSelf: 'center',
        width:"80%",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        backgroundColor:"#90ee90",
      },
      inputTitle: {
        alignSelf: 'flex-start',
        marginTop: 20,
        marginLeft: 20,
      },
      forgot_button: {
        alignSelf: 'center',
        height: 30,
        marginBottom: 30,
      },
})