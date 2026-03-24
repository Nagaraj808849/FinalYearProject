USE [RestaurantManagementSystem]
GO

IF OBJECT_ID('dbo.Reservations', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[Reservations]
END
GO

IF OBJECT_ID('dbo.TableResevation', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[TableResevation](
        [ReservationId] [int] IDENTITY(1,1) NOT NULL,
        [UserName] [nvarchar](100) NOT NULL,
        [UserEmail] [nvarchar](100) NOT NULL,
        [ReservationDateTime] [datetime] NOT NULL,
        [NoOfPeople] [int] NOT NULL,
        [SpecialAttentions] [nvarchar](max) NULL,
     CONSTRAINT [PK_TableResevation] PRIMARY KEY CLUSTERED 
    (
        [ReservationId] ASC
    )
    )
END
GO

IF OBJECT_ID('sp_InsertReservation', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE [dbo].[sp_InsertReservation]
END
GO

CREATE PROCEDURE [dbo].[sp_InsertReservation]
    @UserName nvarchar(100),
    @UserEmail nvarchar(100),
    @ReservationDateTime datetime,
    @NoOfPeople int,
    @SpecialAttentions nvarchar(max) = NULL
AS
BEGIN
    SET NOCOUNT ON;

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

    SELECT SCOPE_IDENTITY() AS ReservationId;
END
GO
