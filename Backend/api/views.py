from django.shortcuts import render
from .serializers import StockPredictionSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import yfinance as yf
from datetime import datetime
import tensorflow as tf
import os
from django.conf import settings
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error,r2_score

# Create your views here.

class StockPredictionApiView(APIView):
    def post(self,request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']

        now = datetime.now()
        start = datetime(now.year-10, now.month,now.day)
        end = now
        df = yf.download(ticker,start,end)
        if df.empty:
            return Response({'error': 'no data found for the given ticker token',
                             'status':status.HTTP_404_NOT_FOUND })
        
        df = df.reset_index()
        #generate basic plot
        plt.switch_backend("AGG")
        plt.figure(figsize=(12,5))
        plt.plot(df.Close,label='Closing Price')
        plt.title(f'Closing Price Of{ticker}')
        plt.xlabel('Days')
        plt.ylabel('Close Price')
        plt.legend()
        # Save the plot to a file
        plot_img_path = f'{ticker}_plot.png'
        plot_img = save_plot(plot_img_path)
        
        #100 days moving average prediction
        ma100 = df.Close.rolling(100).mean()
        plt.switch_backend("AGG")
        plt.figure(figsize=(12,5))
        plt.plot(df.Close,label='Closing Price')
        plt.plot(ma100,'r',label='100 DMA Price')
        plt.title(f'100 days moving average of{ticker}')
        plt.xlabel('Days')
        plt.ylabel('Price')
        plt.legend()
        plot_img_path = f'{ticker}_100ma.png'
        plot_100ma_img = save_plot(plot_img_path)

        #200 days moving average prediction
        ma200 = df.Close.rolling(200).mean()
        plt.switch_backend("AGG")
        plt.figure(figsize=(12,5))
        plt.plot(df.Close,label='Closing Price')
        plt.plot(ma100,'r',label='100 DMA Price')
        plt.plot(ma200,'g',label='200 DMA Price')
        plt.title(f'200 days moving average of{ticker}')
        plt.xlabel('Days')
        plt.ylabel('Price')
        plt.legend()
        plot_img_path = f'{ticker}_200ma.png'
        plot_200ma_img = save_plot(plot_img_path)
        
        #splitting data into training and testing data set
        data_training = pd.DataFrame(df.Close[0:int(len(df)*0.7)])
        data_testing = pd.DataFrame(df.Close[int(len(df)*0.7) : int(len(df))])

        #Scaling down the data between 0 and 1
        scaler = MinMaxScaler(feature_range=(0,1))
        
        #load ML Model

        model = load_model('stock__model.keras')

        ##Preparing Test Data
        past_100_days = data_training.tail(100)
        final_df = pd.concat([past_100_days,data_testing],ignore_index=True)
        input_data = scaler.fit_transform(final_df)

        x_test = []
        y_test = []

        for i in range(100,input_data.shape[0]):
            x_test.append(input_data[i-100 : i])
            y_test.append(input_data[i,0])
        x_test,y_test = np.array(x_test),np.array(y_test)

        #Make predictions
        y_predicted = model.predict(x_test)
        
        #Revert the scaled prices to an original price
        y_predicted = scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
        y_test = scaler.inverse_transform(y_test.reshape(-1,1)).flatten()

        #plot the final prediction

        plt.switch_backend("AGG")
        plt.figure(figsize=(12,5))
        plt.plot(y_test,'b', label='Original Price')
        plt.plot(y_predicted,'r',label='Predicted Price')
        plt.title(f'Final Prediction Price of {ticker}')
        plt.xlabel('Days')
        plt.ylabel('Price')
        plt.legend()
        plot_img_path = f'{ticker}_prediction.png'
        plot_final_prediction_img = save_plot(plot_img_path)

        #Model Evaluation
        mse = mean_squared_error(y_test,y_predicted)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test,y_predicted) 


        return Response({ 
            'status' : 'success',
            'plot_img' : plot_img,
            'plot_100ma_img' : plot_100ma_img,
            'plot_200ma_img':plot_200ma_img,
            'plot_final_prediction_img': plot_final_prediction_img,
            'mse':mse,
            'rmse' : rmse,
            'r2' : r2
         })    
