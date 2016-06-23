package cn.espush.cloud.contrib;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.Date;

/**
 * Created by Sunday on 2016/6/22.
 */


class Finder implements Runnable {
    private static final String SERVERIP = "255.255.255.255";
    private static final int SERVERPORT = 6629;
    private int broadcast_timeout = 2000;
    private DatagramSocket socket = null;
    private String signStr = "";
    private Promise promise = null;

    public Finder(String signStr, Promise promise) {
        this.signStr = signStr;
        this.promise = promise;
    }

    public void loop_2_second_recv() {
        long start_time = new Date().getTime();
        WritableArray outArray = Arguments.createArray();

        while((new Date().getTime() - start_time) < broadcast_timeout) {
            byte[] recbuf = new byte[255];
            long timeout = broadcast_timeout - (new Date().getTime() - start_time);
            DatagramPacket recpacket = new DatagramPacket(recbuf, recbuf.length);

            try {
                socket.setSoTimeout((int) timeout);
                socket.receive(recpacket);
            } catch(SocketTimeoutException e) {
                System.out.println("应该是超时了！");
                break;
            } catch(InterruptedIOException e) {
                e.printStackTrace();
                System.out.println("被其他原因中断？");
                promise.reject("12", e.getMessage());
                return;
            } catch (IOException e) {
                e.printStackTrace();
                promise.reject("11", e.getMessage());
                return;
            }
            byte[] rcvbuf = recpacket.getData();
            String result = new String(rcvbuf, 0, recpacket.getLength());
            if(result.equals(this.signStr)) {
                continue;
            }
            if(result.startsWith("IMHERE")) {
                System.out.println("FIND A DEVICES.");
                WritableMap devInfo = Arguments.createMap();
                devInfo.putString("ipaddr", recpacket.getAddress().getHostAddress());
                devInfo.putString("chipid", result);
                outArray.pushMap(devInfo);
            } else {
                System.out.println("RECV: " + new String(rcvbuf) + ", length: " + recpacket.getLength());
                System.out.println("Server: IP " + recpacket.getAddress().getHostAddress() + "’\n");
            }
        }
        this.promise.resolve(outArray);
    }

    public void run() {
        try {
            InetAddress serverAddress = InetAddress.getByName(SERVERIP);
            System.out.println("Client: Start connecting\n");
            socket = new DatagramSocket();
            byte[] buf = signStr.getBytes();
            DatagramPacket packet = new DatagramPacket(buf, buf.length,
                    serverAddress, SERVERPORT);
            System.out.println("Client: Sending ‘" + new String(buf) + "’\n");
            socket.send(packet);
            System.out.println("Client: Message sent\n");
            System.out.println("Client: Succeed!\n");
        } catch (UnknownHostException e) {
            e.printStackTrace();
            socket.close();
            promise.reject("11", e.getMessage());
            return;
        } catch (SocketException e) {
            e.printStackTrace();
            socket.close();
            promise.reject("11", e.getMessage());
            return;
        } catch (IOException e) {
            e.printStackTrace();
            socket.close();
            promise.reject("11", e.getMessage());
            return;
        }

        // 接收UDP广播，有的手机不支持
        this.loop_2_second_recv();
        socket.close();
    }
}


public class DeviceFinderModule extends ReactContextBaseJavaModule {
    public DeviceFinderModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "DeviceFinderAndroid";
    }

    @ReactMethod
    public void find(String signStr, Promise promise) {
        new Thread(new Finder(signStr, promise)).start();
    }
}
