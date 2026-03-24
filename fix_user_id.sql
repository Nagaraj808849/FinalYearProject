USE [RestaurantManagementSystem]
GO

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'UserId' AND Object_ID = Object_ID(N'dbo.TableResevation'))
BEGIN
    ALTER TABLE [dbo].[TableResevation] ADD [UserId] INT NULL;
    
    ALTER TABLE [dbo].[TableResevation]  WITH CHECK ADD  CONSTRAINT [FK_TableResevation_UserId] FOREIGN KEY([UserId])
    REFERENCES [dbo].[REGISTRATION] ([USERID]);

    ALTER TABLE [dbo].[TableResevation] CHECK CONSTRAINT [FK_TableResevation_UserId];
END
GO

ALTER PROCEDURE [dbo].[sp_InsertReservation]
    @UserName nvarchar(100),
    @UserEmail nvarchar(100),
    @ReservationDateTime datetime,
    @NoOfPeople int,
    @SpecialAttentions nvarchar(max) = NULL,
    @UserId int = NULL
AS
BEGIN
    SET NOCOUNT OFF;

    INSERT INTO [dbo].[TableResevation]
           ([UserName]
           ,[UserEmail]
           ,[ReservationDateTime]
           ,[NoOfPeople]
           ,[SpecialAttentions]
           ,[UserId])
     VALUES
           (@UserName
           ,@UserEmail
           ,@ReservationDateTime
           ,@NoOfPeople
           ,@SpecialAttentions
           ,@UserId)
END
GO
