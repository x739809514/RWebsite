## Async Operation in Network

To make the code work for our general working requirements,  we need to make our program Asynchornic, which means threads won't be blocked when some resources haven't been got. In addition, one host always needs to process a lot of requests from different clients. 

### Server

Firstly, we can use multi-threads to make our server process multiple requests from different clients, and we can create a thread for each connection in a while loop, like this:

```c#
// .....
while (true)
{
    Socket skt = socket.Accept();

    Thread thread = new Thread(ReveiveHandle);
    thread.Start(skt);
}
// .....

private static void ReveiveHandle(object obj)
{
    Socket skt = (Socket)obj;
    string msg = "Connect Successful";
    byte[] bytes = Encoding.UTF8.GetBytes(msg);
    skt.Send(bytes);

    while (true)
    {
        try
        {
            // receive data buffer
            byte[] dataRcv = new byte[1024];
            int lenRcv = skt.Receive(dataRcv);
            if (lenRcv == 0)
            {
                Console.WriteLine("Client is quit");
                break;
            }
            string msgRcv = Encoding.UTF8.GetString(dataRcv, 0, lenRcv);
            Console.WriteLine("Rcv Client Msg: " + msgRcv);
            // send what its receive
            byte[] rcv = Encoding.UTF8.GetBytes(msgRcv);
            skt.Send(rcv);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            break;
        }
    }
}
```

But the above code has a problem which makes it work for general working requirements. If there are lots of connections, such as 10000, then there will be a lot of threads here, that can cost resources. So if there is a thread pool can be better. 

On the other hand, we have the data handling function ---- "`ReveiveHandle`", which is a sync function: 

```c#
byte[] dataRcv = new byte[1024];
int lenRcv = skt.Receive(dataRcv); // if there's no data receive, it will block
if (lenRcv == 0)
{
    Console.WriteLine("Client is quit");
    break;
}
```

To figure out these two problems, we need to make our program async. In c#, we can use `BeginReceive` to start an async receive, and at the bottom of this function, there is a thread pool, which can make program more efficient. Here are some code segments:

```c#
static void CreateASyncReceive()
{
    // ...
        Console.WriteLine("Server Start...");
        socket.BeginAccept(new AsyncCallback(ASyncAccept), new SocketObj() { skt = socket, str = "default" });
    }
    // ...
}

static void ASyncAccept(IAsyncResult result)
{
    // ...
    Socket clientSocket = args.skt.EndAccept(result);

    // ...
    byte[] dataRcv = new byte[1024];
    clientSocket.BeginReceive(dataRcv, 0, 1024, SocketFlags.None, new AsyncCallback(ASyncDataRcv), new ClientSocketObj() { skt = clientSocket, data = dataRcv });

    // since a child thread is closed, so we need to start a new one
    args.skt.BeginAccept(new AsyncCallback(ASyncAccept), new SocketObj() { skt = args.skt, str = "default" });
}
```

In the above code, the main step is: the main thread open a child thread to accept connection from one client, and each connection will have a child thread, then this child thread will open a grandson thread to receive data. Of course, these threads are all in thread pool, which can recycle threads.

### Client

Same as server, we can make our client async, we use `BeginConnect` to start a connection request, and also use `BeginReceive` to receive data. Meanwhile, in the client, we can make our sending operation async too. Here, we use `NetworkStream`, the structure of the code is similar as the server actually. Let's see the code:

```c#
static void ASyncConnection()
{
    // connection is only once
    socket.BeginConnect(pt, new AsyncCallback(ConnectionHandle), new SendObj() { skt = socket, pt = pt });

    // send data
    while (true)
    {
      //ASync Sending data
      //socket.Send(Encoding.UTF8.GetBytes(msgSend));
      byte[] data = Encoding.UTF8.GetBytes(msgSend);
      NetworkStream ns = null;
      try
      {
          ns = new NetworkStream(socket);
          if (ns.CanWrite)
          {
              ns.BeginWrite(
                  data,
                  0,
                  data.Length,
                  new AsyncCallback(SendHandle),
                  ns
              );
          }
      }
      catch (Exception e)
      {
          Console.WriteLine(e.ToString());
      }
    }
}
```

```c#
static void SendHandle(IAsyncResult result)
{
    try
    {

        if (result.AsyncState is NetworkStream ns)
        {
            ns.EndWrite(result);
            ns.Flush();
            ns.Close();
        }
    }
    catch (Exception e)
    {
        Console.WriteLine(e.ToString());
    }
}
```

### Close socket

if we want to break a connection, we can use `Shutdown` and `Close`, this two methods means we close our connection to server/client, we can't send or receive data anymore. But it will still give a signal to server or client in TCP level, which can notice server/client the connection is break;

```c#
socket.Shutdown(SocketShutdown.Both); // both mean shutdown both receive and send
socket.Close();
```



