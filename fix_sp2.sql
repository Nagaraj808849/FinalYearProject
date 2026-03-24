USE [RestaurantManagementSystem]
GO

ALTER PROCEDURE [dbo].[sp_InsertReservation]
    @UserName nvarchar(100),
    @UserEmail nvarchar(100),
    @ReservationDateTime datetime,
    @NoOfPeople int,
    @SpecialAttentions nvarchar(max) = NULL
AS
BEGIN
    SET NOCOUNT OFF; -- Crucial for ExecuteNonQuery to return > 0

    INSERT INTO [dbo].[TableResevation]
           ([UserName]
           ,[UserEmail]
           ,[ReservationDateTime]
           ,[NoOfPeople]
           ,[SpecialAttentions])
     VALUES
           (@UserName
           ,@UserEmail
           ,@ReservationDateTime
           ,@NoOfPeople
           ,@SpecialAttentions)
END
GO
