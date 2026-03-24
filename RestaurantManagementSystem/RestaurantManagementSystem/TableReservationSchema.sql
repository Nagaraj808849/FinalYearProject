IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TableResevation')
BEGIN
    CREATE TABLE TableResevation (
        ReservationId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        UserName NVARCHAR(100) NOT NULL,
        UserEmail NVARCHAR(100) NOT NULL,
        ReservationDateTime DATETIME NOT NULL,
        NoOfPeople INT NOT NULL,
        SpecialAttentions NVARCHAR(MAX) NULL
    );
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_InsertReservation')
BEGIN
    DROP PROCEDURE sp_InsertReservation;
END
GO

CREATE PROCEDURE sp_InsertReservation
    @UserName NVARCHAR(100),
    @UserEmail NVARCHAR(100),
    @ReservationDateTime DATETIME,
    @NoOfPeople INT,
    @SpecialAttentions NVARCHAR(MAX) = NULL,
    @UserId INT = NULL
AS
BEGIN
    INSERT INTO TableResevation (UserName, UserEmail, ReservationDateTime, NoOfPeople, SpecialAttentions, UserId)
    VALUES (@UserName, @UserEmail, @ReservationDateTime, @NoOfPeople, @SpecialAttentions, @UserId);
END
GO
